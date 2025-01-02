
const SaveIcon = ({ onClick }) => {
  return (
    <span className='action-btn save-btn' onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24px" height="24px">
        <path fill="#4CAF50" d="M433.941 129.941L318.059 14.059C309.021 5.021 297.267 0 285.255 0H64c-35.346 0-64 28.654-64 64v384c0 35.346 28.654 64 64 64h320c35.346 0 64-28.654 64-64V192.745c0-12.012-5.021-23.766-14.059-32.804zM224 416c-35.346 0-64-28.654-64-64s28.654-64 64-64 64 28.654 64 64-28.654 64-64 64zm128-224H96V64h192v96h64v32z"/>
      </svg>
    </span>
  );
}

export default SaveIcon;
