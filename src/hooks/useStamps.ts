import { useUserProgress } from '@/contexts/UserProgressContext';

/**
 * Backward compatibility wrapper for useStamps
 * @deprecated Use useUserProgress directly for better error handling
 */
export const useStamps = () => {
  const { stamps, stampsLoading, getStamp, saveStamp, deleteStamp } = useUserProgress();

  // Convert new API to old boolean returns for backward compatibility
  const saveStampLegacy = async (stamp: any): Promise<boolean> => {
    const result = await saveStamp(stamp);
    return result.success;
  };

  const deleteStampLegacy = async (hotdogId: string): Promise<boolean> => {
    const result = await deleteStamp(hotdogId);
    return result.success;
  };

  return {
    stamps,
    loading: stampsLoading,
    getStamp,
    saveStamp: saveStampLegacy,
    deleteStamp: deleteStampLegacy
  };
};
