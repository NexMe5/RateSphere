const Loader = ({ fullScreen = false }) => (
  <div className={fullScreen ? 'loader-fullscreen' : 'loader-inline'}>
    <div className="loader-spinner" />
  </div>
);

export default Loader;
