export default function Icon(props: { index: number}) {
    return <img className="invert-80 opacity-30" src={`/svg/group-${props.index}-icon.svg`}></img>
}