import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, Typography, MenuItem } from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  invoiceTotal: number;
  paidAmount: number;
  onConfirm: (data: { amount: number; method: 'cash' | 'transfer' | 'card' | 'check'; reference?: string; notes?: string }) => void;
};

export const RegisterPaymentModal = ({ open, onClose, invoiceTotal, paidAmount, onConfirm }: Props) => {
  const balance = Math.max(0, invoiceTotal - paidAmount);
  const [amount, setAmount] = useState<number | ''>('');
  const [method, setMethod] = useState<'cash' | 'transfer' | 'card' | 'check'>('cash');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  const valid = amount !== '' && amount > 0 && amount <= balance;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Registrar pago</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Typography variant="body2">Total: ${invoiceTotal.toLocaleString('es-AR')}</Typography>
          <Typography variant="body2">Pagado: ${paidAmount.toLocaleString('es-AR')}</Typography>
          <Typography variant="body2">Saldo: ${balance.toLocaleString('es-AR')}</Typography>

          <TextField
            label="Monto"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
            error={amount !== '' && (amount <= 0 || amount > balance)}
            helperText={amount !== '' && amount > balance ? 'No puede superar el saldo' : ''}
            required
          />
          <TextField select label="Método" fullWidth value={method} onChange={(e) => setMethod(e.target.value as any)}>
            <MenuItem value="cash">Efectivo</MenuItem>
            <MenuItem value="transfer">Transferencia</MenuItem>
            <MenuItem value="card">Tarjeta</MenuItem>
            <MenuItem value="check">Cheque</MenuItem>
          </TextField>
          <TextField label="Referencia (opcional)" fullWidth value={reference} onChange={(e) => setReference(e.target.value)} />
          <TextField label="Notas" fullWidth multiline minRows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" disabled={!valid} onClick={() => onConfirm({ amount: Number(amount), method, reference, notes })}>Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterPaymentModal;

