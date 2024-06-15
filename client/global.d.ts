import vi from 'vitest';

declare global {
    namespace NodeJS {
        interface Global {
            myLocalStorage: {
                getItem: vi.Mock<any, any>;
                setItem: vi.Mock<any, any>;
                clear: vi.Mock<any, any>;
                removeItem: vi.Mock<any, any>;
            };
        }
    }
}
