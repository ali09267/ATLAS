import "../styles/Snackbar.css";

function SnackBar({ message, onUndo }) {
  return (
    <div className="delete-snackbar">
      <div className="delete-snackbar-icon">✓</div>

      <div className="delete-snackbar-content">
        <span>
          <strong>{message}</strong> is deleted
        </span>
      </div>

      <a type="button" className="delete-snackbar-undo" onClick={onUndo}>
        Undo
      </a>

      <div className="delete-snackbar-progress">
        <span />
      </div>
    </div>
  );
}
export default SnackBar;
