export const IconUser = ({ className }: { className?: string }) => {
  const strokeStyle = {
    fill: 'none',
    stroke: '#fff',
    strokeWidth: '30px',
  };

  return (
    <svg
      id="icon-smember"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 560 560"
      width="20"
      className={className}
    >
      <title>Smember</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <circle cx="280" cy="280" r="265" style={strokeStyle}></circle>
          <circle cx="280" cy="210" r="115" style={strokeStyle}></circle>
          <path
            d="M86.82,461.4C124.71,354.71,241.91,298.93,348.6,336.82A205,205,0,0,1,473.18,461.4"
            style={strokeStyle}
          ></path>
        </g>
      </g>
    </svg>
  );
};
export default IconUser;
