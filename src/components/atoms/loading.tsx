type Props = {
  className?: string;
  center?: boolean;
};

const Loading = ({ className = '', center }: Props) => {
  const renderLoading = () => {
    return (
      <div
        className={`h-[40px] w-[40px] animate-spin-circle rounded-[50%] border-[4px] border-[#d9d9d9] border-t-primary ${className}`}
      ></div>
    );
  };

  return (
    <>
      {center ? (
        <div className={'flex item-center justify-center'}>
          {renderLoading()}
        </div>
      ) : (
        renderLoading()
      )}
    </>
  );
};

export default Loading;
