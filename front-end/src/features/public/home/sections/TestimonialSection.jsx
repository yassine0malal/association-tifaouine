import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import styles from "./TestimonialSection.module.css";

export default function TestimonialSection({ t }) {
    const testimonials = t("testimonials", { returnObjects: true });
    const [index, setIndex] = useState(0);

    const nextStep = () => {
        setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    };

    const prevStep = () => {
        setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    return (
        <section className={styles.wrapper}>
            <div className={styles.header}>
                <h2>{t("testimonial.title")}</h2>
                <p>{t("testimonial.subtitle")}</p>
            </div>
            <div className={styles.container}>
                <div className={styles.pattern} />
                <button className={`${styles.navBtn} ${styles.left}`} onClick={prevStep}>
                    <ChevronLeft size={20} />
                </button>
                <div className={styles.content}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className={styles.testimonialCard}
                        >
                            <div className={styles.stars}>
                                {[...Array(testimonials[index].rating)].map((_, i) => (
                                    <Star key={i} size={28} fill="var(--accent)" color="var(--accent)" />
                                ))}
                            </div>
                            <blockquote className={styles.quote}>
                                “{testimonials[index].text}”
                            </blockquote>
                            <cite className={styles.author}>
                                — {testimonials[index].author}
                            </cite>
                        </motion.div>
                    </AnimatePresence>
                </div>
                <button className={`${styles.navBtn} ${styles.right}`} onClick={nextStep}>
                    <ChevronRight size={20} />
                </button>
                <div className={styles.dots}>
                    {testimonials.map((_, i) => (
                        <div
                            key={i}
                            className={`${styles.dot} ${i === index ? styles.activeDot : ""}`}
                            onClick={() => setIndex(i)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}