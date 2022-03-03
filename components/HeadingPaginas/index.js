import headingStyles from "./heading.module.scss"

const Heading = ({texto}) => {
    return (
        <>
            <h1 className={headingStyles.heading} >{texto}</h1>
        </>
    );
}
 
export default Heading;