import React from 'react';
import Dialog from '@my/components/atomic/Dialog';
import { useClearPastContentQuote } from '@my/action-hooks/plan/careplan/plan2';
import { Plan2TableRow } from '../Plan2InputForm';
import QuoteDialogContents from './QuoteDialogContents';

type Props = {
  screenId: string;
  sakuseiDate?: number;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClickReturn: () => void;
  onClickSave: (selectedRows: Plan2TableRow[]) => void;
};

/**
 *  過去内容引用ダイアログ
 */
const QuoteDialog: React.FC<Props> = (props: Props) => {
  const { screenId, sakuseiDate, setIsDialogOpen, onClickReturn, onClickSave } = props;

  const clearPastContentQuote = useClearPastContentQuote();

  /** 戻るボタンをクリックした時の処理 */
  const handleClickReturn = () => {
    onClickReturn();
    setIsDialogOpen(false);
  };

  // 初回
  React.useEffect(() => {
    clearPastContentQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open variant="simple" title="過去内容引用" onClickReturn={handleClickReturn} fullWidth fullHeight selfContentAndActions maxWidth="xl">
      <QuoteDialogContents screenId={screenId} sakuseiDate={sakuseiDate} setIsDialogOpen={setIsDialogOpen} onClickSave={onClickSave} />
    </Dialog>
  );
};

export default QuoteDialog;
