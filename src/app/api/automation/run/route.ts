import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, tasks } = body;
    
    // Handle both old 'action' format and new 'tasks' format
    let actionsToRun: string[] = [];
    
    if (tasks && Array.isArray(tasks)) {
      // New format: tasks array
      actionsToRun = tasks.map(task => {
        switch (task) {
          case 'generate-images':
            return 'content_optimization';
          case 'link-artists':
            return 'content_optimization';
          case 'optimize-content':
            return 'content_optimization';
          case 'categorize-articles':
            return 'content_optimization';
          default:
            return task;
        }
      });
    } else if (action) {
      // Old format: single action
      actionsToRun = [action];
    } else {
      return NextResponse.json(
        { error: 'Either action or tasks parameter is required' },
        { status: 400 }
      );
    }

    const allowedActions = [
      'content_optimization',
      'video_generation',
      'social_media_posting',
      'full_automation_cycle'
    ];

    // Validate all actions
    for (const actionToRun of actionsToRun) {
      if (!allowedActions.includes(actionToRun)) {
        return NextResponse.json(
          { error: `Invalid action specified: ${actionToRun}` },
          { status: 400 }
        );
      }
    }

    console.log(`🤖 Running automation tasks: ${actionsToRun.join(', ')}`);

    const results = [];
    const automationPath = '/workspace/yaadfeed/automation';

    for (const actionToRun of actionsToRun) {
      let command = '';

      switch (actionToRun) {
        case 'content_optimization':
          command = `cd ${automationPath} && python ai_content_optimizer.py`;
          break;
        case 'video_generation':
          command = `cd ${automationPath} && python video_generator.py`;
          break;
        case 'social_media_posting':
          command = `cd ${automationPath} && python social_media_automation.py`;
          break;
        case 'full_automation_cycle':
          command = `cd ${automationPath} && python automation_orchestrator.py`;
          break;
      }

      if (command) {
        try {
          // Execute automation script
          const { stdout, stderr } = await execAsync(command);

          if (stderr) {
            console.error(`Automation stderr for ${actionToRun}:`, stderr);
          }

          results.push({
            action: actionToRun,
            success: true,
            output: stdout,
            error: stderr || null
          });
        } catch (error) {
          console.error(`Automation execution error for ${actionToRun}:`, error);
          results.push({
            action: actionToRun,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      actions: actionsToRun,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Automation execution error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to execute automation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get automation status and recent logs
    const automationPath = '/workspace/yaadfeed/automation';
    
    // Read recent automation summary
    const { stdout: lsOutput } = await execAsync(`ls -la ${automationPath}/automation_summary_*.md | tail -1`);
    
    let lastRun = null;
    if (lsOutput.trim()) {
      const fileName = lsOutput.split(' ').pop()?.trim();
      if (fileName) {
        const { stdout: fileContent } = await execAsync(`cat "${fileName}"`);
        lastRun = {
          file: fileName,
          content: fileContent,
          timestamp: new Date().toISOString()
        };
      }
    }

    // Check if automation is currently running
    const { stdout: processCheck } = await execAsync('ps aux | grep python | grep automation || true');
    const isRunning = processCheck.includes('automation_orchestrator.py');

    return NextResponse.json({
      status: isRunning ? 'running' : 'idle',
      lastRun,
      availableActions: [
        'content_optimization',
        'video_generation', 
        'social_media_posting',
        'full_automation_cycle'
      ]
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to get automation status' },
      { status: 500 }
    );
  }
}
