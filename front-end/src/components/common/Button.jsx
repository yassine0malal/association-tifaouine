import styles from "./Btn.module.css"

export default function Btn({title }){
return (
    <button className={styles.generiqueBtn}>{title} &#8594;</button>
);
}
