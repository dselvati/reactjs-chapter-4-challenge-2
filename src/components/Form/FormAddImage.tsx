import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

interface ToastProps {
  title: string
  description: string
  status: "success" | "error" | "warning" | "info"
}

interface MutationParamsProps {
  title: string
  description: string
  url: string
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  function validateLessThen10MB(event) {
    const [file] = event
    const { size } = file
    const sizeMb = size / 1048576
    // console.log(sizeMb)

    if (sizeMb > 10.0)
      return 'O arquivo deve ser menor que 10MB'

    return true
  }

  const allowedFormats = [
    'image/jpeg',
    'image/png',
    'image/gif',
  ]

  function validateAcceptedFormats(event) {
    const [file] = event
    const { type } = file
    // console.log(type)

    if (!allowedFormats.includes(type))
      return 'Somente são aceitos arquivos PNG, JPEG e GIF'

    return true
  }


  const formValidations = {
    image: {
      // TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: validateLessThen10MB,
        acceptedFormats: validateAcceptedFormats
      }
    },
    title: {
      // TODO REQUIRED, MIN AND MAX LENGTH VALIDATIONS
      required: 'Título obrigatório',
      minLength: { value: 2, message: 'Mínimo de 2 caracteres' },
      maxLength: { value: 20, message: 'Máximo de 20 caracteres' }
    },
    description: {
      // TODO REQUIRED, MAX LENGTH VALIDATIONS
      required: 'Descrição obrigatória',
      maxLength: { value: 65, message: 'Máximo de 65 caracteres' }
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation((params: MutationParamsProps) => {
    return api.post('/api/images', params)
  },
    // TODO MUTATION API POST REQUEST,
    {
      // TODO ONSUCCESS MUTATION
      onSuccess: (data, variables, context) => {
        // I will fire second!
        queryClient.invalidateQueries('images') // Forçar o useInfiniteQuery 'images' a recarregar
        showToast('Imagem cadastrada', 'Sua imagem foi cadastrada com sucesso.', 'success')

      },
      onError: (error, variables, context) => {
        // I will fire second!
        showToast('Falha no cadastro', 'Ocorreu um erro ao tentar cadastrar a sua imagem.', 'error')
      },
      onSettled: (data, error, variables, context) => {
        // Error or success... doesn't matter!
        finishUploadImage()

      }
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit: SubmitHandler<{ title: string }> = async (data: Record<string, unknown>): Promise<void> => {
    try {
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      // TODO EXECUTE ASYNC MUTATION
      // TODO SHOW SUCCESS TOAST

      console.log(data)

      console.log(imageUrl)

      if (!imageUrl) {
        showToast('Imagem não adicionada', 'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.', 'info')
        return
      }

      const params = {
        title: data.title,
        description: data.description,
        url: imageUrl
      }

      mutation.mutate(params as MutationParamsProps)
      // await new Promise(resolve => setTimeout(resolve, 2000))
    } catch {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
      showToast('Falha no cadastro', 'Ocorreu um erro ao tentar cadastrar a sua imagem.', 'error')
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      // finishUploadImage()
    }
  }

  function showToast(title: string, description: string, status: "success" | "error" | "warning" | "info") {
    toast({
      title,
      description,
      status,
      duration: 9000,
      isClosable: true,
      position: 'top'
    })
  }

  // async function handleChangeImage(event: React.ChangeEvent<HTMLInputElement>) {
  //   console.log('handleChangeImage')

  // }

  function finishUploadImage() {
    setImageUrl('')
    reset()
    closeModal()
  }


  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          name="image"
          // onChange={handleChangeImage}
          // TODO SEND IMAGE ERRORS
          error={errors.image}
          // TODO REGISTER IMAGE INPUT WITH VALIDATIONS
          {...register("image",
            formValidations.image
          )}
        />

        <TextInput
          placeholder="Título da imagem..."
          name="title"
          // TODO SEND TITLE ERRORS
          error={errors.title}

          // TODO REGISTER TITLE INPUT WITH VALIDATIONS
          {...register("title",
            formValidations.title
          )}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          name="description"
          // TODO SEND DESCRIPTION ERRORS
          error={errors.description}

          // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS

          {...register("description",
            formValidations.description
          )}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting || mutation.isLoading}
        isDisabled={formState.isSubmitting || mutation.isLoading}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
