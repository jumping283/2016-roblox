import {useEffect, useRef, useState} from "react";
import dayjs from "../../../lib/dayjs";
import {createUseStyles} from "react-jss";

const useStyles = createUseStyles({
  offsaleLabel: {
    color: '#666',
  },
})

const OffsaleDeadline = props => {
  // This doesn't work if the off sale time is 1 month+ into the future.
  const s = useStyles();
  const timer = useRef(null);
  const [label, setLabel] = useState(null);
  const updateLabel = () => {
    if (props.offsaleDeadline === null) {
      setLabel(null);
      return;
    }
    const offSaleTime = dayjs(props.offsaleDeadline);
    const currentTime = dayjs();
    if (offSaleTime.isBefore(currentTime)) {
      setLabel(null);
      return;
    }
    const time = offSaleTime.subtract(currentTime);
    const days = offSaleTime.date() - currentTime.date();
    const hours = offSaleTime.hour() - currentTime.hour();
    const minutes = time.minute();
    const seconds = time.second();

    let newLabel = ``;
    if (days > 0) {
      newLabel += `${days} day${days === 1 ? '' : 's'} `;
    }
    if (hours > 0 || newLabel !== '') {
      newLabel += `${hours} hour${hours === 1 ? '' : 's'} `;
    }
    if (minutes > 0 || newLabel !== '') {
      newLabel += `${minutes} minute${minutes === 1 ? '' : 's'} `;
    }
    if (seconds > 0 || newLabel !== '') {
      newLabel += `${seconds} second${seconds === 1 ? '' : 's'} `;
    }
    if (newLabel === '') {
      setLabel(null);
      return;
    }
    setLabel(newLabel);
  }

  useEffect(() => {
    if (timer.current) {
      clearInterval(timer.currency);
      timer.current = null;
    }
    if (props.offsaleDeadline !== null) {
      timer.current = setInterval(() => {
        updateLabel()
      }, 1000);
      updateLabel();
    }

  }, [props.offsaleDeadline]);

  if (label !== null) {
    return <div>
      <p className={'mt-2 mb-0 text-center ' + s.offsaleLabel}>
        Item goes off sale in:
      </p>
      <p className='fw-bolder mt-0 mb-0 text-center text-danger'>
        {label}
      </p>
    </div>
  }

  return null;
}

export default OffsaleDeadline;