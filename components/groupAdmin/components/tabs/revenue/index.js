import {useState} from "react";
import Mode from "./mode";
import Summary from "./summary";

const GroupRevenue = props => {
  const [mode, setMode] = useState('Summary');

  return <div className='row'>
    <div className='col-12'>
      <Mode mode={mode} setMode={setMode} />
      {
        mode === 'Summary' ? <Summary {...props} /> : null
      }
    </div>
  </div>
}

export default GroupRevenue;