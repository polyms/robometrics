export const Loading: React.FunctionComponent = () => (
  <svg
    xmlSpace="preserve"
    viewBox="0 0 100 100"
    y="0"
    x="0"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    style={{ height: '100%', width: '100%', background: 'rgb(255, 255, 255)' }}
    width="200px"
    height="200px"
  >
    <g
      className="ldl-scale"
      style={{
        transformOrigin: '50% 50%',
        transform: 'rotate(0deg) scale(1, 1)'
      }}
    >
      <g
        style={{
          transformOrigin: '50px 50px',
          transform: 'scale(0.91)',
          animation:
            '1.11111s linear -1.11111s infinite reverse forwards running breath'
        }}
      >
        <path
          strokeMiterlimit="10"
          strokeWidth="8"
          stroke="#333"
          fill="none"
          d="M45.7 10.2L17.6 26.4c-2.7 1.5-4.3 4.4-4.3 7.4v32.4c0 3.1 1.6 5.9 4.3 7.4l28.1 16.2c2.7 1.5 5.9 1.5 8.6 0l28.1-16.2c2.7-1.5 4.3-4.4 4.3-7.4V33.8c0-3.1-1.6-5.9-4.3-7.4L54.3 10.2c-2.7-1.6-5.9-1.6-8.6 0z"
          style={{ stroke: 'rgb(48, 157, 142)' }}
        />
      </g>
    </g>
  </svg>
);
