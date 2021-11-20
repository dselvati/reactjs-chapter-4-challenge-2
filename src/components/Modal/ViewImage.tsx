import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
  useDisclosure,
  Text
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  // TODO MODAL WITH IMAGE AND EXTERNAL LINK
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent
          w="max" // width: max-content;
          maxW="900"
          margin="auto"
          background="pGray.800">
          <ModalBody
            p={0}>
            <Image src={imgUrl} maxW="900" maxH="600" />
          </ModalBody>

          <ModalFooter
            justifyContent="flex-start">
            <Link href={imgUrl} target="_blank">
              {/* <Text color="gray.50">Abrir original</Text> error in tests*/}
              Abrir original
            </Link>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
