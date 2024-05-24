import ShareDBMonaco from "sharedb-monaco";
import { editor } from "monaco-editor";
import ReconnectingWebSocket from "reconnecting-websocket";
import sharedb from "sharedb-client-browser/dist/sharedb-client-umd.cjs";
import * as monaco from "monaco-editor";


export class ShareDBManager {
    private static instance: ShareDBManager;
    private editor: editor.ICodeEditor;
    private binding: ShareDBMonaco;
    private socket: ReconnectingWebSocket;
    private connection: any;

    constructor() {
        // Create a new WebSocket connection
        this.socket = new ReconnectingWebSocket("ws://" + window.location.hostname + ":5802");
        this.connection = new sharedb.Connection(this.socket); // Create a connection to the ShareDB server
    }

    public static getInstance() {
        if (!ShareDBManager.instance) {
            ShareDBManager.instance = new ShareDBManager();
        }
        return ShareDBManager.instance;
    }

    mount(editorRef: editor.ICodeEditor, project_id: number) {
        this.initialize_doc(project_id.toString(), editorRef.getModel()?.uri.toString()!);
        this.editor = editorRef;
        this.binding = new ShareDBMonaco({
            id: this.editor.getModel()?.uri.toString()!,
            namespace: project_id.toString(),
            sharePath: "content",
            connection: this.connection,
            monaco: monaco as any,
            uri: this.editor.getModel()?.uri as any,
        }); // Create a new ShareDBMonaco binding


        const model = this.binding.add(this.editor as any, {
            model: this.editor.getModel() as any,
            uri: this.editor.getModel()?.uri as any,
            langId: this.editor.getModel()?.getLanguageId(),
        }); // Add the editor to the binding

        this.binding.setViewOnly(false); // Set the editor to be editable
    }

    initialize_doc(collection: string, id: string) {
        // Initialize a new document in the ShareDB server
        const doc = this.connection.get(collection, id);
        doc.subscribe((error) => {
            if (error) return console.error(error)

            // If doc.type is undefined, the document has not been created, so let's create it
            if (!doc.type) {
                doc.create({ content: "" }, (error) => {
                    if (error) console.error(error)
                })
            }
        })
    }
}