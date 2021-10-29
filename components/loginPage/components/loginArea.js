import { useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { login } from "../../../services/auth";
import useButtonStyles from "../../../styles/buttonStyles";
import ActionButton from "../../actionButton";

const useStyles = createUseStyles({
    header: {
        fontSize: '35px',
    },
    input: {
        width: 'calc(100% - 90px)',
        display: 'inline-block',
    },
    inputLabel: {
        width: '90px',
        display: 'inline-block',
        color: '#343434',
    },
    signInButtonWrapper: {
        float: 'right',
    },
    loginWrapper: {
        maxWidth: '325px',
    }
})

const LoginArea = props => {
    const buttonStyles = useButtonStyles();
    const s = useStyles();
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const [locked, setLocked] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const onLoginClick = e => {
        setLocked(true);
        setFeedback(null);
        login({
            username: usernameRef.current.value,
            password: passwordRef.current.value,
        }).then(() => {
            window.location.href = '/home';
        }).catch(e => {
            setFeedback(e.response?.data?.errors[0]?.message || e.message);
        }).finally(() => {
            setLocked(false);
        })
    }

    return <div className='row'>
        <div className='col-12'>
            <h1 className={s.header}>Login to ROBLOX</h1>
            {feedback && <p className='mb-2 mt-1 text-danger'>{feedback}</p>}
        </div>
        <div className='col-12'>
            <div className={'ms-4 me-4 ' + s.loginWrapper}>
                <div>
                    <div className={s.inputLabel}>
                        <p className='fw-bold me-4'>Username:</p>
                    </div>
                    <div className={s.input}>
                        <input disabled={locked} type='text' className='w-100' ref={usernameRef}></input>
                    </div>
                </div>
                <div className='mt-2'>
                    <div className={s.inputLabel}>
                        <p className='fw-bold me-4'>Password:</p>
                    </div>
                    <div className={s.input}>
                        <input disabled={locked} type='password' className='w-100' ref={passwordRef}></input>
                    </div>
                </div>
                <div className='mt-2'>
                    <div className={s.signInButtonWrapper}>
                        <ActionButton disabled={locked} label='Sign In' className={buttonStyles.continueButton} onClick={onLoginClick}></ActionButton>
                    </div>
                </div>
            </div>
        </div>

    </div>
}

export default LoginArea;