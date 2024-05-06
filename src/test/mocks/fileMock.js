/* eslint-disable quotes */
/* eslint-disable sonarjs/no-duplicate-string */

export const TextFileSmall = new File(['some text larger than 100 kilobytes'], 'small text file.txt', { type: 'text/plain' });

export const TextFileLarge = new File(
    [
        `One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked. "What's happened to me?" he thought. It wasn't a dream. His room, a proper human room although a little too small, lay peacefully between its four familiar walls. A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame. It showed a lady fitted out with a fur hat and fur boa who sat upright, raising a heavy fur muff that covered the whole of her lower arm towards the viewer. Gregor then turned to look out the window at the dull weather. Drops`
    ],
    'large text file.txt',
    { type: 'text/plain' }
);

export const TextFileMock = new File(
    ['some text larger than 100 kilobytes, some text larger than 100 kilobytes, some text larger than 100 kilobytes'],
    'test file.txt',
    { type: 'text/plain' }
);

export const TextFileMock2 = new File(
    [
        'some text larger than 100 kilobytes, some text larger than 100 kilobytes, some text larger than 100 kilobytes some other contern'
    ],
    'another text file.txt',
    { type: 'text/plain' }
);

export const TextFileMock3 = new File(
    [
        'some text larger than 100 kilobytes, some text larger than 100 kilobytes, some text larger than 100 kilobytes some other content and some more content'
    ],
    'yet another text file.txt',
    { type: 'text/plain' }
);
