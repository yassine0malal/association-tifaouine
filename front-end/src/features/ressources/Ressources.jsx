import styles from "./Ressources.module.css";

import PageHero from "../../components/common/PageHero";
import heroImg from "../../assets/images/projects_hero.jpg";
import ai from "../../assets/icons/ai.png";
import document from "../../assets/icons/document.png";
import download from "../../assets/icons/dawnload.png";
import library from "../../assets/images/library.png";

const resourcesData = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=400&fit=crop",
        title: "Digital Archiving Standards v2.0",
        description: "Global Digital Asset Management framework for heritage preservation.",
        fileSize: "14.2 MB",
        fileType: "PDF",
        downloadUrl: "/resources/digital-archiving-standards.pdf"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=400&fit=crop",
        title: "Grant Proposal Template",
        description: "Ready-to-use template for funding applications in cultural projects.",
        fileSize: "8.5 MB",
        fileType: "DOCX",
        downloadUrl: "/resources/grant-proposal-template.docx"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=400&fit=crop",
        title: "Community Impact Analysis",
        description: "Methodology and tools to measure social impact of rural initiatives.",
        fileSize: "12.3 MB",
        fileType: "PDF",
        downloadUrl: "/resources/community-impact-analysis.pdf"
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=400&fit=crop",
        title: "Grain History Recording Masterclass",
        description: "Guide to documenting traditional farming knowledge and practices.",
        fileSize: "22.7 MB",
        fileType: "MP4",
        downloadUrl: "/resources/grain-history-masterclass.mp4"
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=400&fit=crop",
        title: "Partnership Agreement Boilerplate",
        description: "Legal template for collaboration with NGOs and local authorities.",
        fileSize: "5.8 MB",
        fileType: "DOCX",
        downloadUrl: "/resources/partnership-agreement.docx"
    },
    {
        id: 6,
        image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=300&h=400&fit=crop",
        title: "Site Maintenance Guidelines",
        description: "Best practices for maintaining water and agricultural infrastructure.",
        fileSize: "9.1 MB",
        fileType: "PDF",
        downloadUrl: "/resources/site-maintenance-guidelines.pdf"
    }
];
export default function RessourcesPage() {

    return (
        <div className={styles.ressourcesPage}>
            <PageHero title={"Our Ressources"} heroImg={heroImg} />
            <div className={styles.ressourcesContainer}>

                <div className={styles.title}>
                    <h2>Featured Insights</h2>
                </div>

                <div className={styles.bestRepportOrganigram}>

                    {/* -----Left----- */}

                    <div className={styles.leftSide}>
                        <img src={library} alt="library" />

                        <div className={styles.contentBestContainer}>

                            <div className={styles.text}>

                                <div className={styles.top}>
                                    <span>Rapport</span>
                                    <span>Project ARCH-2024-EU</span>
                                </div>

                                <h2>The 2024 State of Heritage Preservation Report</h2>

                                <p>
                                    A comprehensive analysis of cultural preservation efforts
                                    across three continents, focusing on sustainable community integration
                                    and digital archiving.
                                    across three continents, focusing on sustainable community integration
                                    and digital archiving.
                                </p>

                            </div>

                            <div className={styles.bottomsDetails}>
                                <div className={styles.imagMetaData}>
                                    <img src={document} alt="document" />
                                    <p>14.2 MB PDF</p>
                                </div>
                                <div className={styles.downloadButtom}>
                                    <button>Download</button>
                                    <img src={download} alt="" />
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* ------Right----- */}

                    <div className={styles.rightSide}>
                        <div className={styles.textContent}>
                            <img src={ai} alt="intillegent" />
                            <div className={styles.topLeft}>
                                <span>Guide</span>
                                <span>Collaboration: Discover how we works</span>
                            </div>
                            <h2>The 2024 State of Heritage Preservation Report</h2>
                            <p>Discover how our association's
                                grassroots initiatives are preserving
                                cultural wisdom across generations and
                                building stronger, more connected
                                communities.
                            </p>
                        </div>
                        <button>Read Full Report</button>
                    </div>
                </div>

                {/* ------------------------Cards--------------------------  */}

                <div className={styles.rapportCards}>

                    <div className={styles.header}>
                        <h2>Resource Library</h2>
                        <div className={styles.content}>
                            <p>Showing 6 of 152 items</p>
                            <div className={styles.filter}>
                                <span>Sort by: </span>
                                <select>
                                    <option selected value="most-recent">Most Recent</option>
                                    <option value="most-recent">Last Week</option>
                                    <option value="most-recent">Yesterday</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ----Card---- */}

                    <div className={styles.cardsContent}>

                        {resourcesData.map((item) => (
                            <div key={item.id} className={styles.card}>

                                <div className={styles.imageWrapper} data-count={"Document"} >
                                    <img src={item.image} alt={item.title} />
                                </div>

                                <div className={styles.footerCard}>
                                    <div className={styles.titles}>
                                        <h3>{item.title}</h3>
                                        <p>{item.description}</p>
                                    </div>

                                    <div className={styles.bottomsDetailsCard}>

                                        <div className={styles.imagMetaDataCard}>
                                            <span >{item.fileSize}</span> <span> {item.fileType}</span>
                                        </div>

                                        <a href={item.downloadUrl} download>
                                            <button>
                                                <img src={download} alt="download" />
                                            </button>
                                        </a>

                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                    <div className={styles.loadMore}>

                    <button>Load More Resources</button>
                    </div>

                </div>

            </div>
        </div>
    );
}