import { Button, Dialog, DialogActions, DialogContent } from "@mui/material"


interface props {
    children: React.ReactNode
    openDialog: boolean
    setOpenDialog: (state: boolean) => void
    onConfirm: () => void
}

export function ConfirmDialog({children, openDialog, setOpenDialog, onConfirm}: props) {
    return (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogContent>
                    <h3>Confirm {children}:</h3>
                    <DialogContent>
                        <DialogActions>
                            <Button variant="contained" onClick={() => {
                                setOpenDialog(false)
                                onConfirm()
                            }}>Yes</Button>
                            <Button variant="outlined" onClick={() => setOpenDialog(false)}>No</Button>
                        </DialogActions>
                    </DialogContent>
                </DialogContent>
            </Dialog>
    )
}