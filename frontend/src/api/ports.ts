import { apiClient, USE_MOCK, simulateDelay } from './client';
import { mockPorts } from '../mock';
import type { PortInfo } from '../types/models';

export async function getPorts(): Promise<PortInfo[]> {
  if (USE_MOCK) {
    return simulateDelay(mockPorts);
  }
  // Fallback to real API when backend implements this
  const { data } = await apiClient.get<PortInfo[]>('/ports/');
  return data;
}

export async function getPortById(id: number): Promise<PortInfo | undefined> {
  if (USE_MOCK) {
    return simulateDelay(mockPorts.find((p) => p.id === id));
  }
  const { data } = await apiClient.get<PortInfo>(`/ports/${id}/`);
  return data;
}
