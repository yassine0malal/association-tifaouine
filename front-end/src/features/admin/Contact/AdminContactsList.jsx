// import React, { useState, useMemo } from 'react';
// import styles from './Contact.module.css';
// import ConfirmPopup from "../../../components/popup/ConfirmPopup" // Path to your popup file

// const INITIAL_MESSAGES = [
//     { 
//         id: 1, 
//         name: "Marc Bernard", 
//         email: "marc.bernard@email.fr", 
//         subject: "Donation d'archives familiales", 
//         message: "Bonjour, je souhaiterais donner des documents appartenant à mon grand-père concernant l'histoire de la ville. Comment procéder ?",
//         read: false, 
//     },
//     { 
//         id: 2, 
//         name: "Amélie Dupont", 
//         email: "a.dupont@culture.org", 
//         subject: "Partenariat Journées du Patrimoine", 
//         message: "Nous organisons un événement le mois prochain et aimerions inclure Heritage Hearth dans notre parcours culturel.",
//         read: true, 
//     },
//     { 
//         id: 3, 
//         name: "Sophie Martin", 
//         email: "sophie.m@orange.fr", 
//         subject: "Photos de l'inauguration", 
//         message: "J'ai pris quelques clichés lors de la soirée d'inauguration. Voulez-vous que je vous les envoie par WeTransfer ?",
//         read: false, 
//     },
// ];

// export default function AdminContactsList() {
//     const [messages, setMessages] = useState(INITIAL_MESSAGES);
//     const [filter, setFilter] = useState('tous');
//     const [search, setSearch] = useState('');
//     const [expandedId, setExpandedId] = useState(null);

//     // --- POPUP STATE ---
//     const [isPopupOpen, setIsPopupOpen] = useState(false);
//     const [msgToDelete, setMsgToDelete] = useState(null);

//     // 1. Open popup and store the message object we want to delete
//     const triggerDeletePopup = (e, msg) => {
//         e.stopPropagation(); // Prevent card from expanding
//         setMsgToDelete(msg);
//         setIsPopupOpen(true);
//     };

//     // 2. The actual deletion logic called by ConfirmPopup
//     const handleConfirmDelete = () => {
//         setMessages(prev => prev.filter(m => m.id !== msgToDelete.id));
//         if (expandedId === msgToDelete.id) setExpandedId(null);
//         setIsPopupOpen(false);
//         setMsgToDelete(null);
//     };

//     const handleExpandMessage = (id) => {
//         if (expandedId === id) {
//             setExpandedId(null);
//         } else {
//             setExpandedId(id);
//             setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
//         }
//     };

//     const toggleRead = (id) => {
//         setMessages(messages.map(m => m.id === id ? { ...m, read: !m.read } : m));
//     };

//     const filteredMessages = useMemo(() => {
//         return messages.filter(m => {
//             const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
//                 m.subject.toLowerCase().includes(search.toLowerCase());

//             if (filter === 'non-lus') return matchesSearch && !m.read;
//             if (filter === 'lus') return matchesSearch && m.read;
//             return matchesSearch;
//         });
//     }, [messages, filter, search]);

//     const unreadCount = messages.filter(m => !m.read).length;

//     return (
//         <div className={styles.container}>
//             {/* INTEGRATION OF YOUR CONFIRM POPUP */}
//             <ConfirmPopup 
//                 isOpen={isPopupOpen}
//                 onClose={() => setIsPopupOpen(false)}
//                 onConfirm={handleConfirmDelete}
//                 variant="danger"
//                 title="Supprimer le message ?"
//                 description="Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible."
//                 detailLabel="Expéditeur"
//                 detailValue={msgToDelete ? msgToDelete.name : ""}
//                 confirmLabel="Supprimer"
//                 cancelLabel="Annuler"
//             />

//             <header className={styles.header}>
//                 <h1 className={styles.title}>GESTION DES MESSAGES</h1>
//                 <p className={styles.subtitle}>Gérez les demandes de contact de la communauté Heritage Hearth.</p>
//             </header>

//             <div className={styles.searchWrapper}>
//                 <span className={styles.searchIcon}>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -0.5 25 25" fill="none">
//                         <path fillRule="evenodd" clipRule="evenodd" d="M5.5 11.1455C5.49956 8.21437 7.56975 5.69108 10.4445 5.11883C13.3193 4.54659 16.198 6.08477 17.32 8.79267C18.4421 11.5006 17.495 14.624 15.058 16.2528C12.621 17.8815 9.37287 17.562 7.3 15.4895C6.14763 14.3376 5.50014 12.775 5.5 11.1455Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                         <path d="M15.989 15.4905L19.5 19.0015" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                     </svg>
//                 </span>
//                 <input
//                     type="text"
//                     placeholder="Rechercher un message ou un expéditeur..."
//                     className={styles.searchInput}
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                 />
//             </div>

//             <div className={styles.filterBar}>
//                 <button className={`${styles.filterBtn} ${filter === 'tous' ? styles.active : ''}`} onClick={() => setFilter('tous')}>Tous</button>
//                 <button className={`${styles.filterBtn} ${filter === 'non-lus' ? styles.active : ''}`} onClick={() => setFilter('non-lus')}>
//                     Non lus ({unreadCount})
//                 </button>
//                 <button className={`${styles.filterBtn} ${filter === 'lus' ? styles.active : ''}`} onClick={() => setFilter('lus')}>Lus</button>
//             </div>

//             <div className={styles.list}>
//                 {filteredMessages.map(msg => (
//                     <div
//                         key={msg.id}
//                         className={`${styles.card} ${expandedId === msg.id ? styles.expandedCard : ''}`}
//                     >
//                         <div className={styles.cardMainRow} onClick={() => handleExpandMessage(msg.id)}>
//                             <div className={styles.avatar}>
//                                 {msg.name.split(' ').map(n => n[0]).join('')}
//                             </div>

//                             <div className={styles.content}>
//                                 <div className={styles.senderInfo}>
//                                     <span className={styles.name}>{msg.name}</span>
//                                     <span className={styles.dot}>•</span>
//                                     <span className={styles.email}>{msg.email}</span>
//                                 </div>
//                                 <p className={styles.subject}>{msg.subject}</p>
//                             </div>

//                             <div className={styles.actions}>
//                                 <button
//                                     className={`${styles.actionBtn} ${msg.read ? styles.readIcon : ''}`}
//                                     onClick={(e) => { e.stopPropagation(); toggleRead(msg.id); }}
//                                 >
//                                     {msg.read ?
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                             <path d="M7 12L11.9497 16.9497L22.5572 6.34326M2.0498 12.0503L6.99955 17M17.606 6.39355L12.3027 11.6969" stroke="#999" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
//                                         </svg>
//                                         :
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                             <path d="M7 12L11.9497 16.9497L22.5572 6.34326M2.0498 12.0503L6.99955 17M17.606 6.39355L12.3027 11.6969" stroke="#2ecc71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                                         </svg>
//                                     }
//                                 </button>
//                                 <button
//                                     className={styles.deleteBtn}
//                                     onClick={(e) => triggerDeletePopup(e, msg)}
//                                 >
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024"><path d="M960 160h-291.2a160 160 0 0 0-313.6 0H64a32 32 0 0 0 0 64h896a32 32 0 0 0 0-64zM512 96a96 96 0 0 1 90.24 64h-180.48A96 96 0 0 1 512 96zM832 640a32 32 0 0 0-32 32v224a32 32 0 0 1-32 32H256a32 32 0 0 1-32-32V320a32 32 0 0 0-64 0v576a96 96 0 0 0 96 96h512a96 96 0 0 0 96-96v-224a32 32 0 0 0-32-32z" fill="#231815" /><path d="M384 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0zM544 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0zM704 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0z" fill="#231815" /></svg>
//                                 </button>
//                             </div>
//                         </div>

//                         {expandedId === msg.id && (
//                             <div className={styles.messageBody}>
//                                 <div className={styles.bodyDivider}></div>
//                                 <p>{msg.message}</p>
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }




import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Contact.module.css';
import ConfirmPopup from "../../../components/popup/ConfirmPopup";
import { fetchContacts, deleteContact } from "./adminContactSlice"; // adjust path

export default function AdminContactsList() {
    const dispatch = useDispatch();
    const { contacts, loading, error } = useSelector((state) => state.contacts);

    const [filter, setFilter] = useState('tous');
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    // POPUP STATE
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [msgToDelete, setMsgToDelete] = useState(null);

    // FETCH DATA ON MOUNT
    useEffect(() => {
        dispatch(fetchContacts());
    }, [dispatch]);

    const triggerDeletePopup = (e, msg) => {
        e.stopPropagation();
        setMsgToDelete(msg);
        setIsPopupOpen(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteContact(msgToDelete.id));
        if (expandedId === msgToDelete.id) setExpandedId(null);
        setIsPopupOpen(false);
        setMsgToDelete(null);
    };

    const handleExpandMessage = (id) => {
        if (expandedId === id) {
            setExpandedId(null);
        } else {
            setExpandedId(id);
            // Optional: Dispatch a "mark as read" API call here if needed
        }
    };

    const filteredMessages = useMemo(() => {
        if (!contacts) return [];
        return contacts.filter(m => {
            const matchesSearch = 
                m.name?.toLowerCase().includes(search.toLowerCase()) ||
                m.subject?.toLowerCase().includes(search.toLowerCase());

            if (filter === 'non-lus') return matchesSearch && !m.read;
            if (filter === 'lus') return matchesSearch && m.read;
            return matchesSearch;
        });
    }, [contacts, filter, search]);

    const unreadCount = contacts?.filter(m => !m.read).length || 0;

    if (loading && contacts.length === 0) return <p>Chargement...</p>;
    if (error) return <p>Erreur: {error}</p>;

    return (
        <div className={styles.container}>
            <ConfirmPopup 
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onConfirm={handleConfirmDelete}
                variant="danger"
                title="Supprimer le message ?"
                description="Cette action supprimera définitivement le message de la base de données."
                detailLabel="Expéditeur"
                detailValue={msgToDelete?.name || ""}
            />

            <header className={styles.header}>
                <h1 className={styles.title}>GESTION DES MESSAGES</h1>
                <p className={styles.subtitle}>Gérez les demandes de contact en temps réel.</p>
            </header>

            <div className={styles.searchWrapper}>
                <input
                    type="text"
                    placeholder="Rechercher..."
                    className={styles.searchInput}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className={styles.filterBar}>
                <button className={filter === 'tous' ? styles.active : ''} onClick={() => setFilter('tous')}>Tous</button>
                <button className={filter === 'non-lus' ? styles.active : ''} onClick={() => setFilter('non-lus')}>
                    Non lus ({unreadCount})
                </button>
                <button className={filter === 'lus' ? styles.active : ''} onClick={() => setFilter('lus')}>Lus</button>
            </div>

            <div className={styles.list}>
                {filteredMessages.map(msg => (
                    <div key={msg.id} className={`${styles.card} ${expandedId === msg.id ? styles.expandedCard : ''}`}>
                        <div className={styles.cardMainRow} onClick={() => handleExpandMessage(msg.id)}>
                            <div className={styles.avatar}>{msg.name?.charAt(0)}</div>
                            <div className={styles.content}>
                                <div className={styles.senderInfo}>
                                    <span className={styles.name}>{msg.name}</span>
                                    <span className={styles.email}>{msg.email}</span>
                                </div>
                                <p className={styles.subject}>{msg.subject}</p>
                            </div>
                            <div className={styles.actions}>
                                <button className={styles.deleteBtn} onClick={(e) => triggerDeletePopup(e, msg)}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {expandedId === msg.id && (
                            <div className={styles.messageBody}>
                                <div className={styles.bodyDivider}></div>
                                <p>{msg.message}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}