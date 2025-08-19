import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (!action) {
      return NextResponse.json(
        { error: 'Action parameter is required' },
        { status: 400 }
      );
    }

    const allowedActions = [
      'content_optimization',
      'video_generation',
      'social_media_posting',
      'full_automation_cycle'
    ];

    if (!allowedActions.includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action specified' },
        { status: 400 }
      );
    }

    let command = '';
    const automationPath = '/workspace/yaadfeed/automation';

    switch (action) {
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

    // Execute automation script
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error('Automation stderr:', stderr);
    }

    return NextResponse.json({
      success: true,
      action,
      output: stdout,
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
