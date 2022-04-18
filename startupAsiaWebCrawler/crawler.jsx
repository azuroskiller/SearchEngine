import axios from 'axios'
import { useState, useEffect } from 'react'
import { toast } from "react-hot-toast"

const WebCrawler = () =>{

    const [fullText, setFullText] = useState({})
    const [loading, selectLoading] = useState(false)
    const [idxSelected, setIdxSelected] = useState([])
    const [insertLoading, setInsertLoading] = useState(false)

    crawl = async (urls) =>{
        
    }
}