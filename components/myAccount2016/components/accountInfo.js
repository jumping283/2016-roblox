import React, { useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { setUserDescription } from "../../../services/accountInformation";
import AuthenticationStore from "../../../stores/authentication";
import Dropdown2016 from "../../dropdown2016";
import Selector from "../../selector";
import useCardStyles from "../../userProfile/styles/card";
import MyAccountStore from "../stores/myAccountStore"
import Subtitle from "./subtitle";

const useEditButtonStyles = createUseStyles({
  editButton: {
    float: 'right',
    color: '#666',
    cursor: 'pointer',
  },
})

const EditButton = (props) => {
  const s = useEditButtonStyles();
  return <span className={s.editButton} onClick={props.onClick}>Edit</span>
}

const useStyles = createUseStyles({
  accountInfoLabel: {
    marginBottom: '6px',
    color: '#c3c3c3',
    fontSize: '15px',
  },
  accountInfoValue: {
    color: '#666',
  },
  descInput: {
    width: '100%',
    borderRadius: '4px',
    padding: '6px 8px',
    border: '1px solid #c3c3c3',
  },
  select: {
    borderRadius: '2px',
    fontSize: '16px',
  },
  disabled: {
    background: 'white!important',
    color: '#c3c3c3',
    '&:focus': {
      color: '#c3c3c3',
      boxShadow: 'none',
    },
  },
  fakeInput: {
    height: '100%',
    overflow: 'hidden',
  },
  saveButtonWrapper: {
    float: 'right',
    marginTop: '16px',
  },
  saveButton: {
    background: 'white',
    border: '1px solid #c3c3c3',
    borderRadius: '4px',
    fontSize: '16px',
    padding: '4px 8px',
    cursor: 'pointer',
  },
  genderUnselected: {
    color: '#c3c3c3',
    cursor: 'pointer',
  },
});

const AccountInfo = props => {
  const store = MyAccountStore.useContainer();
  const auth = AuthenticationStore.useContainer();
  const descRef = useRef(null);

  const cardStyles = useCardStyles();
  const s = useStyles();
  return <div className='row'>
    <div className='col-12 mt-2'>
      <Subtitle>Account Info</Subtitle>
      <div className={cardStyles.card + ' p-3'}>
        <p className={s.accountInfoLabel}>Username: <span className={s.accountInfoValue}>{auth.username}</span> <EditButton onClick={() => {
          store.setModal('CHANGE_USERNAME');
        }}></EditButton></p>
        <p className={s.accountInfoLabel}>Password: <span className={s.accountInfoValue}>**********</span> <EditButton onClick={() => {
          store.setModal('CHANGE_PASSWORD');
        }}></EditButton></p>
        <p className={s.accountInfoLabel}>Email Address: <span className={s.accountInfoValue}>{store.email}</span> <EditButton onClick={() => {
          store.setModal('CHANGE_EMAIL');
        }}></EditButton></p>
      </div>
    </div>
    <div className='col-12 mt-2'>
      <Subtitle>Personal</Subtitle>
      <div className={cardStyles.card + ' p-3'}>
        <textarea ref={descRef} className={s.descInput} rows={3} defaultValue={store.description}></textarea>
        <p className='mb-0 font-size-12'>Do not provide any details that can be used to identify you outside ROBLOX.</p>
        <div className='mt-1'>
          <div className='row'>
            <div className='col pe-0'>
              <input className={'form-control ' + s.select + ' ' + s.disabled} value='Birthday' readOnly={true} type='text'></input>
            </div>
            <div className='col ps-0 pe-0'>
              <select className={'form-control ' + s.select}>
                <option value='1'>January</option>
                <option value='2'>February</option>
                <option value='3'>March</option>
                <option value='4'>April</option>
                <option value='5'>May</option>
                <option value='6'>June</option>
                <option value='7'>July</option>
                <option value='8'>August</option>
                <option value='9'>September</option>
                <option value='10'>October</option>
                <option value='11'>November</option>
                <option value='12'>December</option>
              </select>
            </div>
            <div className='col ps-0 pe-0'>
              <select className={'form-control ' + s.select}>
                {[... new Array(31)].map((v, i) => {
                  return <option value={i + 1} key={i}>{i + 1}</option>
                })}
              </select>
            </div>
            <div className='col ps-0'>
              <select className={'form-control ' + s.select}>
                {[... new Array(100)].map((v, i) => {
                  return <option value={2016 - i} key={i}>{2016 - i}</option>
                })}
              </select>
            </div>
          </div>
        </div>
        <div className='mt-2'>
          <div className='row'>
            <div className='col pe-0'>
              <input className={'form-control ' + s.select + ' ' + s.disabled} value='Gender' readOnly={true} type='text'></input>
            </div>
            <div className='col ps-0 pe-0'>
              <div className={'card ' + s.fakeInput}>
                <p className={'text-center mb-2 mt-2 ' + (store.gender !== 2 ? s.genderUnselected : '')} onClick={() => {
                  store.setGender(2);
                }}>Male</p>
              </div>
            </div>
            <div className='col ps-0'>
              <div className={'card ' + s.fakeInput}>
                <p className={'text-center mb-2 mt-2 ' + (store.gender !== 3 ? s.genderUnselected : '')} onClick={() => {
                  store.setGender(3);
                }}>Female</p>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-1 mb-4'>
          <div className={s.saveButtonWrapper}>
            <button className={s.saveButton} onClick={() => {
              // todo: gender, birthdate
              setUserDescription({
                newDescription: descRef.current.value,
              });
            }}>Save</button>
          </div>
        </div>
        <div className='mt-4 mb-4'>&emsp;</div>
      </div>
    </div>
  </div>
}

export default AccountInfo;