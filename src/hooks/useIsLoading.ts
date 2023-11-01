import useAppSelector from './useAppSelector';

const useIsLoading = () => {
  const authLoading = useAppSelector((state) => state.auth.loading);
  const connectionLoading = useAppSelector((state) => !state.connection.isConnected);
  const usersLoading = useAppSelector((state) => state.userData.loading);
  const resourcesLoading = useAppSelector((state) => state.userData.loading);

  return (
    authLoading ||
    connectionLoading ||
    usersLoading ||
    resourcesLoading
  );
};

export default useIsLoading;