import { useLoaderData, useFetcher } from 'react-router-dom';
import { SubmitButton } from './SubmitButton';
import { useRef, useState } from 'react';

export function PostForm() {
  const { threadId, board } = useLoaderData();
  const fetcher = useFetcher();
  const inputRef = useRef();

  const [fileList, setFileList] = useState([]);

  const fileTypes = [
    'image/jpeg',
    'image/png',
    'image/bmp',
    'image/gif',
    'image/webp',
  ];

  const errors = {
    fileSizeError: fileTooLarge(),
    fileTypeError: checkFileType(),
  };

  function fileTooLarge() {
    if (fileList.length < 1) return null;
    const totalSize = fileList.reduce((sum, v) => sum + v.size, 0);
    return totalSize > 5 * 1024 * 1024 ? 'file too large' : null;
  }

  function checkFileType() {
    if (fileList.length < 1) return null;
    const notAllowedType = fileList.some(file => !fileTypes.includes(file.type));
    return notAllowedType ? 'not allowed file type' : null;
  }

  function onChange(e) {
    setFileList(Array.from(e.target.files)); // FileList => Arr, can't manipulate it otherwise
  }

  return (
    <fetcher.Form
      action='/posting/' method='POST' encType='multipart/form-data'
      className='w-1/4 m-auto min-w-min mb-20' // min-w-min bc input elmnt has fixed default width
    >

      {(errors.fileSizeError || errors.fileTypeError) &&
        Object.values(errors).map((er, idx) =>
          <output key={idx} className='block text-center text-red-500 text-lg mb-3'>
            {er}
          </output>
        )}

      {fetcher.data &&
        <output className='block text-center text-red-500 text-lg mb-3'>
          {fetcher.data.errors}
        </output>}

      <div className='flex'>
        <input type='text' name='poster'
          className='grow border border-gray-600 bg-slate-800 text-white' />
        <SubmitButton
          fileError={(errors.fileSizeError || errors.fileTypeError) !== null}
          submitting={fetcher.state === 'submitting'}
          buttonType='submit' />
      </div>

      <textarea required name='text' rows='7'
        minLength='1' maxLength='10000'
        className='min-w-[100%] border border-gray-600 bg-slate-800 text-white resize'
      />

      <label
        className='py-3 flex [&_span]:hover:text-white border border-gray-600 tracking-widest cursor-pointer hover:bg-gray-700 bg-slate-800'>
        <span className='m-auto text-gray-400 '>SELECT A FILE</span>
        <input ref={inputRef} onChange={onChange}
          multiple name='file' type='file' className='hidden' accept='image/*'
        />
      </label>

      <div className='min-w-max'>
        {attachedFiles()?.map((file, idx) => {
            let fileUrl = URL.createObjectURL(file);
            return (
              <picture key={idx}
                onClick={() => removeFileFromFileList(idx, fileUrl)}
                className='mr-2 relative w-fit inline-block'
              >
                <source srcSet={fileUrl} type={file.type} title={file.name}
                  style={{ maxWidth: '100px', maxHeight: '100px', display: 'inline' }}
                />
                <img src='' title={file.name}  // without 'alt' so as to display an empty box
                  style={{ width: '100px', height: '100px', display: 'inline' }}
                />
                <span className='absolute right-2 pointer-events-none text-red-400 font-bold'>X</span>
              </picture>
            )
          }
        )}
      </div>

      <input type='hidden' name='board' readOnly value={board} />
      <input type='hidden' name='threadId' readOnly value={threadId} />
    </fetcher.Form>
  );

  function attachedFiles() {
    return fileList.length < 1 ? null
      : fileList.map(file => file);
  }

  function removeFileFromFileList(idxToRemove, fileUrl) {
    const dt = new DataTransfer(); // workaround bc can't change input.files directly
    const nextFileList = fileList.filter((_, idx) => idx !== idxToRemove);  // need sync. value instead of async
    nextFileList.forEach(file => dt.items.add(file));
    inputRef.current.files = dt.files;

    URL.revokeObjectURL(fileUrl);
    setFileList(nextFileList);
  }
}
