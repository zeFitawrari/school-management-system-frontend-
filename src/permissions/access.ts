
export type AccessGrant = readonly string[];

export type BranchScope = {
  activeBranchId?: string | null;
  assignedBranchIds?: readonly string[];
  crossBranch?: boolean;
};

export function hasPermission(granted: AccessGrant, required?: string | readonly string[]): boolean {
  if (!required || (Array.isArray(required) && required.length === 0)) {
    return true;
  }

  const needed = Array.isArray(required) ? required : [required];

  return needed.every((permission) => granted.includes(permission));
}

export function hasAnyPermission(granted: AccessGrant, required: readonly string[]): boolean {
  if (required.length === 0) {
    return true;
  }

  return required.some((permission) => granted.includes(permission));
}

export function hasAllPermissions(granted: AccessGrant, required: readonly string[]): boolean {
  return required.every((permission) => granted.includes(permission));
}

export function isOwnRecord(ownerId: string | undefined, userId: string | undefined): boolean {
  return ownerId !== undefined && ownerId !== null && ownerId === userId;
}

export function isLinkedChild(linkedChildIds: readonly string[] | undefined, childId: string | undefined): boolean {
  return childId !== undefined && linkedChildIds !== undefined && linkedChildIds.includes(childId);
}

export function isSameBranch(recordBranchId: string | undefined, activeBranchId: string | null | undefined): boolean {
  return recordBranchId !== undefined && recordBranchId !== null && recordBranchId === activeBranchId;
}

export function isAccessibleBranch(recordBranchId: string | undefined, scope: BranchScope): boolean {
  if (recordBranchId === undefined || recordBranchId === null) {
    return false;
  }

  if (scope.crossBranch) {
    return true;
  }

  if (scope.assignedBranchIds && scope.assignedBranchIds.includes(recordBranchId)) {
    return true;
  }

  return recordBranchId === scope.activeBranchId;
}

export function defaultDeny(): false {
  return false;
}
