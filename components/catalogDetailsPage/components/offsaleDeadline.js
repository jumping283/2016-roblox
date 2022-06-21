import {useEffect, useRef, useState} from "react";
import dayjs from "../../../lib/dayjs";
import {createUseStyles} from "react-jss";

const useStyles = createUseStyles({
  offsaleLabel: {
    color: '#666',
  },
})

const OffsaleDeadline = props => {
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

    let newLabel = ``;
    if (time.day() > 0 || newLabel !== '') {
      newLabel += `${time.day()} day${time.day() === 1 ? '' : 's'}`;
    }
    if (time.hour() > 0 || newLabel !== '') {
      newLabel += `, ${time.hour()} hour${time.hour() === 1 ? '' : 's'}`;
    }
    if (time.minute() > 0 || newLabel !== '') {
      newLabel += `, ${time.minute()} minute${time.minute() === 1 ? '' : 's'}`;
    }
    if (time.second() > 0 || newLabel !== '') {
      newLabel += `, ${time.second()} second${time.second() === 1 ? '' : 's'}`;
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