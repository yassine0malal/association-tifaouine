import styles from './pageHero.module.css'

export default function PageHero(props) {
    return (
        <div
          className={styles.hero}
          style={{ backgroundImage: `url(${props.heroImg})` }}
        >
          <h1>{props.title}</h1>
        </div>
    );
}