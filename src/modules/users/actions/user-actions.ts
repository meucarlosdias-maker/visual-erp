'use server';

import { successResponse, errorResponse } from '@/lib/action-response';
import type { ActionResponse } from '@/lib/action-response';
import type { User, UserInvite, UserUpdate } from '../types';
import { userService } from '../services/user-service';

export async function listUsers(): Promise<ActionResponse<User[]>> {
  try {
    const data = await userService.list();
    return successResponse(data);
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function getUser(id: string): Promise<ActionResponse<User>> {
  try {
    const data = await userService.get(id);
    return successResponse(data);
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function inviteUser(data: UserInvite): Promise<ActionResponse<User>> {
  try {
    const result = await userService.invite(data);
    return successResponse(result);
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function updateUser(id: string, data: UserUpdate): Promise<ActionResponse<User>> {
  try {
    const result = await userService.update(id, data);
    return successResponse(result);
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function toggleUserActive(id: string, current: string): Promise<ActionResponse<User>> {
  try {
    const result = await userService.toggleActive(id, current);
    return successResponse(result);
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function removeUser(id: string): Promise<ActionResponse<void>> {
  try {
    await userService.delete(id);
    return successResponse(undefined);
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}
