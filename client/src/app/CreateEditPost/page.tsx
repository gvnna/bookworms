'use client';

import React, {useState} from "react";
import SidebarLayout from "components/sidebar";
import { TextInput } from "components";
import { Button } from "components/ui/button";
import { SidebarProvider

 } from "components/ui/sidebar";
export default function CreateEditPost() {
    const [title, setTitle] = useState("");
    const [numPages, setNumPages] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");

    const handleCancel = () => {
        setTitle("");
        setNumPages("");
        setDescription("");
        setImage("");
    };

    const handlePublish = () => {
        console.log("Publicação enviada:", {title, numPages, description, image});
    };

    return (
        <div className="flex h-screen bg-white">
            <SidebarProvider>
                <SidebarLayout/>
            </SidebarProvider>
            <div>
                {/* inputs */}
            </div>
        </div>


    )
}