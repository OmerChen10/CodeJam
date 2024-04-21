

interface ProjectCreatorProps {
    setPopUpMenuMode: (mode: string) => void;
    sendCreateRequest: () => void;
}

export function ProjectCreator({ setPopUpMenuMode, sendCreateRequest }: ProjectCreatorProps) {
    return (
        <div className="popUpWindow">
            <div id="project-creator-container">
                <h1 id="project-creator-title">Create New Project</h1>
                <div className="input-container">
                    <input type="text" className="input-group mb-3" id="project-creator-name" placeholder="Project Name" aria-label="Project Name"/>
                    <input type="text" className="input-group mb-3" id="project-description" placeholder="Project Description" aria-label="Project Description"/>
                </div>
                <div className="button-container">
                    <button id="submit-button" className="btn btn-success grey" onClick={sendCreateRequest}>Create Project</button>
                    <button id="cancel-button" className="btn btn-danger" onClick={() => {setPopUpMenuMode("none")}}>Cancel</button>
                </div>
            </div>
            </div>
    )
}