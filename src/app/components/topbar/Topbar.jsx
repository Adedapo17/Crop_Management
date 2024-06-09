import { AiOutlineSearch } from "react-icons/ai"
import styles from "./topbar.module.css"
import Image from "next/image"

const Topbar = () => {
  return (
    <div className={styles.searchfield}>
          <div className={styles.search}>
            <AiOutlineSearch size={18} />
            <input className={styles.input} type="text" placeholder="Search" />
          </div>
          <Image
            src="/dummy-profile.png"
            width={45}
            height={45}
            className={styles.profilepic}
          />
        </div>
  )
}

export default Topbar