import { AiOutlineSearch } from "react-icons/ai";
import styles from "./topbar.module.css";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { FaArrowLeft } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";
import { useState } from "react";

const Topbar = ({ showSearch,showLinks,showMenu }) => {
  const { data } = useSession();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownLinkVisible,setDropdownLinkVisible ] = useState(false)

  const handleProfileClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLinkClick = ()=>{
    setDropdownLinkVisible(!dropdownLinkVisible)
  }

  const handleLogout = () => {
    signOut();
  };
  const user = data?.user;

  return (
    <div className={styles.searchfield}>

      {showMenu ? ( <div  className={styles.hamburger}>
      <GiHamburgerMenu  onClick={handleLinkClick} size={25}/>
      {dropdownLinkVisible && (
            <div className={styles.dropdownLinkMenu}>
              <div className={styles.linkDiv}>
              <Link href="/predict">
        Predict
        </Link>
        <Link   href="/forecast">
        Forecast
        </Link>
              </div>
            </div>
          )}
      </div>) : null}

     
      
      
      {showSearch ? (
        <div className={styles.search}>
          <AiOutlineSearch size={18} />
          <input className={styles.input} type="text" placeholder="Search" />
        </div>
      ) : (
        <div className={styles.backButton}>
          <Link href="/predict">
            <FaArrowLeft size={18} />
          </Link>
        </div>
      )}
     {
      showLinks ?(
        <div className={styles.link}>
        <Link className={styles.links} href="/predict">
        Predict
        </Link>
        <Link className={styles.links}  href="/forecast">
        Forecast
        </Link>
      </div>
      ) : null
     }

      <div className={styles.profileDiv}>
        <h3 className={styles.welcome}> Welcome, {user?.name}</h3>
        <div className={styles.profileContainer} onClick={handleProfileClick}>
          <Image
            src={!user ? "/dummy-profile.png" : user.image}
            width={35}
            height={35}
            className={styles.profilepic}
          />
          {dropdownVisible && (
            <div className={styles.dropdownMenu}>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
