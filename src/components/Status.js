const Status = ({ isIcoOpen }) => {
  const dotStyle = {
    width: '11px',
    height: '11px',
    borderRadius: '50%',
    display: 'inline-block',
    marginLeft: '5px',
    verticalAlign: 'middle', 
  };

  const activeDotStyle = {
    background: '#5cb85c', 
  };

  const inactiveDotStyle = {
    background: '#d9d9d9', 
  };

  const doneDotStyle = {
    background: '#d9534f', 
  };

  const getStatusText = () => {
    return isIcoOpen ? 'Active' : 'Inactive';
  };

  return (
    <div className="ml-auto d-flex align-items-center">
      <h3 style={{ fontSize: '1.3em', margin: '4px', marginRight: '6px' }}>
        {getStatusText()}
      </h3>
      <div
        className="ml-2 rounded"
        style={{
          ...dotStyle,
          ...(isIcoOpen ? activeDotStyle : doneDotStyle),
          ...(isIcoOpen ? {} : inactiveDotStyle),
        }}
      ></div>
    </div>
  );
};

export default Status;

