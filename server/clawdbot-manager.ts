/**
 * Clawdbot Process Manager
 * Manages lifecycle of Clawdbot instances for each client
 */

import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import { generateConfigFile, getInstanceWorkspace, getInstanceConfigPath } from './clawdbot-config';

// Store running processes
const runningProcesses = new Map<number, ChildProcess>();

/**
 * Initialize workspace for a client instance
 */
export async function initializeInstanceWorkspace(clientId: number): Promise<void> {
  const workspace = getInstanceWorkspace(clientId);
  
  try {
    // Create workspace directory
    await fs.mkdir(workspace, { recursive: true });
    
    // Create subdirectories
    await fs.mkdir(path.join(workspace, 'sessions'), { recursive: true });
    await fs.mkdir(path.join(workspace, 'logs'), { recursive: true });
    
    console.log(`[Clawdbot Manager] Initialized workspace for client ${clientId}`);
  } catch (error) {
    console.error(`[Clawdbot Manager] Failed to initialize workspace for client ${clientId}:`, error);
    throw error;
  }
}

/**
 * Write config file for a client instance
 */
export async function writeInstanceConfig(params: {
  clientId: number;
  businessName: string;
  whatsappNumber?: string;
  assistantName?: string;
  assistantPersonality?: string;
}): Promise<string> {
  const configPath = getInstanceConfigPath(params.clientId);
  const configContent = generateConfigFile(params);
  
  try {
    await fs.writeFile(configPath, configContent, 'utf-8');
    console.log(`[Clawdbot Manager] Wrote config for client ${params.clientId}`);
    return configPath;
  } catch (error) {
    console.error(`[Clawdbot Manager] Failed to write config for client ${params.clientId}:`, error);
    throw error;
  }
}

/**
 * Start Clawdbot instance for a client
 * NOTE: This is a placeholder implementation. In production, you would:
 * 1. Ensure Clawdbot is installed globally or in a known location
 * 2. Use proper process management (PM2, systemd, etc.)
 * 3. Handle authentication and session persistence
 */
export async function startInstance(clientId: number): Promise<{ success: boolean; message: string; processId?: number }> {
  try {
    // Check if already running
    if (runningProcesses.has(clientId)) {
      return {
        success: false,
        message: 'Instance already running',
      };
    }

    const workspace = getInstanceWorkspace(clientId);
    const configPath = getInstanceConfigPath(clientId);
    
    // Verify config exists
    try {
      await fs.access(configPath);
    } catch {
      return {
        success: false,
        message: 'Config file not found. Initialize instance first.',
      };
    }

    // NOTE: This is a simplified version. In production:
    // - Install clawdbot globally: npm install -g clawdbot
    // - Use proper authentication flow
    // - Handle QR code generation for WhatsApp pairing
    
    // Placeholder: We would spawn the actual clawdbot process here
    // const process = spawn('clawdbot', ['gateway', '--config', configPath], {
    //   cwd: workspace,
    //   detached: true,
    //   stdio: 'ignore',
    // });
    
    // For now, we'll simulate a process
    const mockProcessId = Math.floor(Math.random() * 10000);
    
    console.log(`[Clawdbot Manager] Started instance for client ${clientId} (mock PID: ${mockProcessId})`);
    
    return {
      success: true,
      message: 'Instance started successfully',
      processId: mockProcessId,
    };
  } catch (error) {
    console.error(`[Clawdbot Manager] Failed to start instance for client ${clientId}:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Stop Clawdbot instance for a client
 */
export async function stopInstance(clientId: number): Promise<{ success: boolean; message: string }> {
  try {
    const process = runningProcesses.get(clientId);
    
    if (!process) {
      return {
        success: false,
        message: 'Instance not running',
      };
    }

    // Kill the process
    process.kill('SIGTERM');
    runningProcesses.delete(clientId);
    
    console.log(`[Clawdbot Manager] Stopped instance for client ${clientId}`);
    
    return {
      success: true,
      message: 'Instance stopped successfully',
    };
  } catch (error) {
    console.error(`[Clawdbot Manager] Failed to stop instance for client ${clientId}:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Restart Clawdbot instance for a client
 */
export async function restartInstance(clientId: number): Promise<{ success: boolean; message: string }> {
  const stopResult = await stopInstance(clientId);
  if (!stopResult.success && stopResult.message !== 'Instance not running') {
    return stopResult;
  }
  
  // Wait a bit before restarting
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return await startInstance(clientId);
}

/**
 * Get status of a Clawdbot instance
 */
export function getInstanceStatus(clientId: number): { running: boolean; processId?: number } {
  const process = runningProcesses.get(clientId);
  
  return {
    running: !!process && !process.killed,
    processId: process?.pid,
  };
}

/**
 * Generate QR code for WhatsApp pairing
 * NOTE: This is a placeholder. In production, you would:
 * 1. Start the Clawdbot gateway
 * 2. Capture the QR code from stdout or a callback
 * 3. Return the QR code as base64 or SVG
 */
export async function generatePairingQRCode(clientId: number): Promise<{ success: boolean; qrCode?: string; message: string }> {
  try {
    // In production, this would:
    // 1. Start clawdbot in pairing mode
    // 2. Listen for QR code event
    // 3. Return the actual QR code
    
    // For now, return a placeholder
    const placeholderQR = `data:image/svg+xml;base64,${Buffer.from(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
        <rect width="200" height="200" fill="white"/>
        <text x="50%" y="50%" text-anchor="middle" fill="black" font-size="14">
          QR Code Placeholder
          Client ${clientId}
        </text>
      </svg>
    `).toString('base64')}`;
    
    console.log(`[Clawdbot Manager] Generated QR code for client ${clientId}`);
    
    return {
      success: true,
      qrCode: placeholderQR,
      message: 'QR code generated successfully',
    };
  } catch (error) {
    console.error(`[Clawdbot Manager] Failed to generate QR code for client ${clientId}:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Health check for a Clawdbot instance
 */
export async function healthCheck(clientId: number): Promise<{ healthy: boolean; message: string }> {
  const status = getInstanceStatus(clientId);
  
  if (!status.running) {
    return {
      healthy: false,
      message: 'Instance not running',
    };
  }
  
  // In production, you would:
  // 1. Check if the process is responsive
  // 2. Verify WhatsApp connection status
  // 3. Check for errors in logs
  
  return {
    healthy: true,
    message: 'Instance healthy',
  };
}
