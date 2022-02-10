import { Routes, Route, Navigate } from "react-router-dom"

import AppBar from "./appbar"
import Video from "./video"

export default function Dashboard(){
    return  <>
        <AppBar />
        
        <Video />
    </>
}