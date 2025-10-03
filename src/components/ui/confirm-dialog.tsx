import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { type ComponentPropsWithRef, type ReactNode } from 'react';

import {
  AlertDialog,
  type AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LoadingButton } from '@/components/ui/loading-button';
import { Spinner } from '@/components/ui/spinner';

/* eslint-disable react/prop-types */

export type ConfigUpdater = (
  config: ((previous: ConfirmOptions) => ConfirmOptions) | ConfirmOptions,
) => void;

export interface ConfirmContextValue {
  confirm: ConfirmFunction;
  updateConfig: ConfigUpdater;
}

export interface ConfirmDialogState {
  config: ConfirmOptions;
  isLoading: boolean; // Internal loading state
  isOpen: boolean;
  resolver: ((value: boolean) => void) | null;
}

export interface ConfirmFunction {
  (options: ConfirmOptions): Promise<boolean>;
  updateConfig?: ConfigUpdater;
}

export interface ConfirmOptions {
  alertDialogContent?: ComponentPropsWithRef<typeof AlertDialogContent>;
  alertDialogDescription?: ComponentPropsWithRef<typeof AlertDialogDescription>;
  alertDialogFooter?: ComponentPropsWithRef<typeof AlertDialogFooter>;
  alertDialogHeader?: ComponentPropsWithRef<typeof AlertDialogHeader>;
  alertDialogOverlay?: ComponentPropsWithRef<typeof AlertDialogOverlay>;
  alertDialogTitle?: ComponentPropsWithRef<typeof AlertDialogTitle>;
  cancelButton?: ComponentPropsWithRef<typeof AlertDialogCancel> | null;
  cancelText?: string;
  confirmButton?: ComponentPropsWithRef<typeof AlertDialogAction>;
  confirmText?: string;
  contentSlot?: ReactNode;
  customActions?: EnhancedCustomActions | LegacyCustomActions;
  description?: ReactNode;
  icon?: ReactNode;
  isLoading?: boolean; // External loading state control
  onConfirm?: () => boolean | Promise<boolean> | void; // Added support for async functions
  setIsLoading?: (isLoading: boolean) => void; // Callback to update external loading state
  title?: ReactNode;
}

export interface CustomActionsProps {
  cancel: () => void;
  config: ConfirmOptions;
  confirm: () => void;
  isLoading: boolean;
  setConfig: ConfigUpdater;
}

export type EnhancedCustomActions = (props: CustomActionsProps) => ReactNode;

export type LegacyCustomActions = (
  onConfirm: () => void,
  onCancel: () => void,
) => ReactNode;

export const ConfirmContext = createContext<ConfirmContextValue | undefined>(
  undefined,
);

const baseDefaultOptions: ConfirmOptions = {
  alertDialogContent: {},
  alertDialogDescription: {},
  alertDialogFooter: {},
  alertDialogHeader: {},
  alertDialogTitle: {},
  cancelButton: {},
  cancelText: 'Cancel',
  confirmButton: {},
  confirmText: 'Confirm',
  description: '',
  title: '',
};

function isLegacyCustomActions(
  function_: EnhancedCustomActions | LegacyCustomActions,
): function_ is LegacyCustomActions {
  return function_.length === 2;
}

const ConfirmDialogContent: React.FC<{
  config: ConfirmOptions;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  setConfig: (
    config: ((previous: ConfirmOptions) => ConfirmOptions) | ConfirmOptions,
  ) => void;
}> = memo(({ config, isLoading, onCancel, onConfirm, setConfig }) => {
  const {
    alertDialogContent,
    alertDialogDescription,
    alertDialogFooter,
    alertDialogHeader,
    alertDialogOverlay,
    alertDialogTitle,
    cancelButton,
    cancelText,
    confirmButton,
    confirmText,
    contentSlot,
    customActions,
    description,
    icon,
    title,
  } = config;

  const renderActions = () => {
    if (!customActions) {
      return (
        <>
          {cancelButton !== null && (
            <AlertDialogCancel
              onClick={onCancel}
              {...cancelButton}
              disabled={isLoading || cancelButton?.disabled} // Disable during loading
              variant="ghost"
            >
              {isLoading ? (
                <Spinner className="size-6 !stroke-primary !text-primary" />
              ) : (
                cancelText
              )}
            </AlertDialogCancel>
          )}
          <LoadingButton
            onClick={onConfirm}
            {...confirmButton}
            disabled={confirmButton?.disabled} // For styling purposes
            isLoading={isLoading} // Disable during loading
          >
            {confirmText}
          </LoadingButton>
        </>
      );
    }

    if (isLegacyCustomActions(customActions)) {
      return customActions(onConfirm, onCancel);
    }

    return customActions({
      cancel: onCancel,
      config,
      confirm: onConfirm,
      isLoading, // Pass loading state to custom actions
      setConfig,
    });
  };

  const renderTitle = () => {
    if (!title && !icon) {
      return null;
    }

    return (
      <AlertDialogTitle {...alertDialogTitle}>
        {icon}
        {title}
      </AlertDialogTitle>
    );
  };

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay {...alertDialogOverlay} />
      <AlertDialogContent {...alertDialogContent}>
        <AlertDialogHeader {...alertDialogHeader}>
          {renderTitle()}
          {description && (
            <AlertDialogDescription dir="ltr" {...alertDialogDescription}>
              {description}
            </AlertDialogDescription>
          )}
          {contentSlot}
        </AlertDialogHeader>
        <AlertDialogFooter {...alertDialogFooter}>
          {renderActions()}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogPortal>
  );
});

ConfirmDialogContent.displayName = 'ConfirmDialogContent';

const ConfirmDialog: React.FC<{
  config: ConfirmOptions;
  isLoading: boolean; // Combined loading state
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onOpenChange: (isOpen: boolean) => void;
  setConfig: (
    config: ((previous: ConfirmOptions) => ConfirmOptions) | ConfirmOptions,
  ) => void;
}> = memo(
  ({
    config,
    isLoading,
    isOpen,
    onCancel,
    onConfirm,
    onOpenChange,
    setConfig,
  }) => (
    <AlertDialog onOpenChange={onOpenChange} open={isOpen}>
      <ConfirmDialogContent
        config={config}
        isLoading={isLoading}
        onCancel={onCancel}
        onConfirm={onConfirm}
        setConfig={setConfig}
      />
    </AlertDialog>
  ),
);

ConfirmDialog.displayName = 'ConfirmDialog';

export const ConfirmDialogProvider: React.FC<{
  children: React.ReactNode;
  defaultOptions?: ConfirmOptions;
}> = ({ children, defaultOptions = {} }) => {
  const [dialogState, setDialogState] = useState<ConfirmDialogState>({
    config: baseDefaultOptions,
    isLoading: false, // Internal loading state
    isOpen: false,
    resolver: null,
  });

  // Determine the effective loading state (external takes precedence if provided)
  const effectiveIsLoading =
    dialogState.config.isLoading === undefined
      ? dialogState.isLoading
      : dialogState.config.isLoading;

  // Sync internal loading state with external if setIsLoading is provided
  useEffect(() => {
    if (
      dialogState.config.setIsLoading &&
      dialogState.isLoading !== undefined
    ) {
      dialogState.config.setIsLoading(dialogState.isLoading);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogState.isLoading, dialogState.config.setIsLoading]);

  const mergedDefaultOptions = useMemo(
    () => ({
      ...baseDefaultOptions,
      ...defaultOptions,
    }),
    [defaultOptions],
  );

  const updateConfig = useCallback(
    (
      newConfig:
        | ((previous: ConfirmOptions) => ConfirmOptions)
        | ConfirmOptions,
    ) => {
      setDialogState((previous) => ({
        ...previous,
        config:
          typeof newConfig === 'function'
            ? newConfig(previous.config)
            : { ...previous.config, ...newConfig },
      }));
    },
    [],
  );

  const confirm = useCallback(
    (options: ConfirmOptions) => {
      setDialogState((previous) => ({
        config: { ...mergedDefaultOptions, ...options },
        isLoading: false,
        isOpen: true,
        resolver: previous.resolver,
      }));
      return new Promise<boolean>((resolve) => {
        setDialogState((previous) => ({
          ...previous,
          resolver: resolve,
        }));
      });
    },
    [mergedDefaultOptions],
  );

  const handleConfirm = useCallback(async () => {
    // Only update internal loading state if external isn't provided
    if (dialogState.config.isLoading === undefined) {
      setDialogState((previous) => ({
        ...previous,
        isLoading: true,
      }));
    } else if (dialogState.config.setIsLoading) {
      // If external control is provided, use it
      dialogState.config.setIsLoading(true);
    }

    try {
      // Check if there's a custom onConfirm function in the config
      const { onConfirm } = dialogState.config;
      let shouldClose = true;

      if (onConfirm) {
        // Execute the onConfirm function and await if it's a Promise
        const result = onConfirm();
        if (result instanceof Promise) {
          shouldClose = await result;
        } else if (typeof result === 'boolean') {
          shouldClose = result;
        }
      }

      // Only close the dialog if the operation was successful
      if (shouldClose) {
        setDialogState((previous) => {
          if (previous.resolver) {
            previous.resolver(true);
          }
          return {
            ...previous,
            isLoading: false,
            isOpen: false,
            resolver: null,
          };
        });

        // Also update external loading state if provided
        if (dialogState.config.setIsLoading) {
          dialogState.config.setIsLoading(false);
        }
      } else {
        // If shouldClose is false, just turn off loading state
        if (dialogState.config.isLoading === undefined) {
          setDialogState((previous) => ({
            ...previous,
            isLoading: false,
          }));
        } else if (dialogState.config.setIsLoading) {
          dialogState.config.setIsLoading(false);
        }
      }
    } catch (error) {
      // In case of error, turn off loading state but keep dialog open
      console.error('Error in confirm dialog action:', error);

      if (dialogState.config.isLoading === undefined) {
        setDialogState((previous) => ({
          ...previous,
          isLoading: false,
        }));
      } else if (dialogState.config.setIsLoading) {
        dialogState.config.setIsLoading(false);
      }
    }
  }, [dialogState.config]);

  const handleCancel = useCallback(() => {
    // Don't allow cancellation during loading
    if (effectiveIsLoading) return;

    setDialogState((previous) => {
      if (previous.resolver) {
        previous.resolver(false);
      }
      return {
        ...previous,
        isOpen: false,
        resolver: null,
      };
    });
  }, [effectiveIsLoading]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      // Prevent closing the dialog during loading
      if (!open && !effectiveIsLoading) {
        handleCancel();
      }
    },
    [handleCancel, effectiveIsLoading],
  );

  const contextValue = useMemo(
    () => ({
      confirm,
      updateConfig,
    }),
    [confirm, updateConfig],
  );

  return (
    <ConfirmContext.Provider value={contextValue}>
      {children}
      <ConfirmDialog
        config={dialogState.config}
        isLoading={effectiveIsLoading}
        isOpen={dialogState.isOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        onOpenChange={handleOpenChange}
        setConfig={updateConfig}
      />
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmDialogProvider');
  }

  const { confirm, updateConfig } = context;

  const enhancedConfirm = confirm;
  enhancedConfirm.updateConfig = updateConfig;

  return enhancedConfirm as {
    updateConfig: ConfirmContextValue['updateConfig'];
  } & ConfirmFunction;
};
