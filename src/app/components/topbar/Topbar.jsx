import { AiOutlineSearch } from "react-icons/ai"
import styles from "./topbar.module.css"
import Image from "next/image"
import { useSession } from "next-auth/react"
import {FaArrowLeft} from "react-icons/fa"
import Link from "next/link"


const Topbar = ({showSearch}) => {

  const {data} = useSession();
 const user = data?.user


  return (
    <div className={styles.searchfield}>
          {showSearch ? <div className={styles.search}>
            <AiOutlineSearch size={18} />
            <input className={styles.input} type="text" placeholder="Search" />
          </div>
        : 
          <div className={styles.backButton}>
            <Link href="/predict">
                <FaArrowLeft size={18} />
            </Link>
          </div>  
        
        }
          
          <div className={styles.profileDiv}>
            <h3 className={styles.welcome}> Welcome, {user?.name}</h3>
          <Image
            src={!user ? "/dummy-profile.png" : user.image}
            width={35}
            height={35}
            className={styles.profilepic}
          />
          </div>
        </div>
  )
}

export default Topbar