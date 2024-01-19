const LoadingSpin = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-3">
      <span className="loading loading-spinner loading-lg"></span>
      <p className="text-lg font-semibold">Loading</p>
    </div>
  );
};

export default LoadingSpin;
