import { SimpleGrid, useDisclosure, Grid } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // TODO MODAL USEDISCLOSURE
  const { onOpen, isOpen, onClose } = useDisclosure();
  // const [modalIsOpen, setModalIsOpen] = useState(false)

  // TODO SELECTED IMAGE URL STATE
  const [imgUrl, setImgUrl] = useState('')

  // TODO FUNCTION HANDLE VIEW IMAGE
  function handleModalClose() {
    onClose()
    setImgUrl('')
  }

  return (
    <>
      {/* TODO CARD GRID */}
      <Grid templateColumns="repeat(3, 1fr)" gap={10}>
        {
          cards?.map(card => (
            <Card key={card.id} data={card} viewImage={() => {
              onOpen()
              setImgUrl(card.url)
            }} />
          ))
        }
      </Grid>

      {/* TODO MODALVIEWIMAGE */}
      <ModalViewImage isOpen={isOpen} onClose={handleModalClose} imgUrl={imgUrl} />
    </>
  );
}
