/**
 * Creator link
 * @param {{type: string | number; id: number; name: string;}} props 
 * @returns 
 */
const CreatorLink = (props) => {
  return <a href={(props.type === 'User' || props.type === 1) ? '/User.aspx?ID=' + props.id : '/My/Groups.aspx?gid=' + props.id}>
    {props.name}
  </a>
}

export default CreatorLink;