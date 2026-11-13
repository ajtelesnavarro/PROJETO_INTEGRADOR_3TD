
import { Router } from 'express';
import * as PedidoController from '../controllers/PedidoController.js';

const router = Router();

router.get('/', PedidoController.listar);
router.get('/:id', PedidoController.buscarPorOrcamento);
router.post('/', PedidoController.criar);
router.put('/:id', PedidoController.atualizar);
router.delete('/:id', PedidoController.excluir);

export default router;
