import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  '@global': {
    body: {
      'background': '#e3e3e3',
    },
  },
});

const Theme2016 = props => {
  const s = useStyles();
  return props.children
}

export default Theme2016;