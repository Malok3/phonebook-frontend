
const Notification = (props) => {
    if (props.message === null) {
        return null
      }
    const notificationClass = props.success ? 'notification success' : 'notification error';

    return (
    <div className={notificationClass}>
        {props.message}
    </div>
    );
  }

export default Notification