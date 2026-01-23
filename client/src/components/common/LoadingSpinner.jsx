const LoadingSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`${sizeClasses[size]} border-2 border-primary/30 border-t-primary rounded-full animate-spin`}
    />
  );
};

export default LoadingSpinner;
