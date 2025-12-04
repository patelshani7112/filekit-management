/**
 * EditorToolbar Component
 * 
 * Reusable toolbar for PDF editing interfaces
 * Used in: Organize PDF, Rotate PDF, Delete Pages, Extract Pages, etc.
 * 
 * Features:
 * - Back to Upload button
 * - Action buttons (configurable)
 * - Save/Export button
 * - Mobile responsive (collapses to mobile menu)
 */

import { Button } from "../../ui/button";
import { GradientButton } from "../../ui/gradient-button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";

export interface ToolbarAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: "default" | "destructive" | "ghost" | "outline";
  disabled?: boolean;
  tooltip?: string;
  className?: string;
  hideOnMobile?: boolean; // Hide this action on mobile menu
}

export interface ToolbarActionGroup {
  id: string;
  actions: ToolbarAction[];
}

interface EditorToolbarProps {
  // Navigation
  onBack: () => void;
  backLabel?: string;
  
  // Actions (can be single array or grouped)
  actions?: ToolbarAction[];
  actionGroups?: ToolbarActionGroup[];
  
  // Primary action (right side)
  primaryAction?: {
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    disabled?: boolean;
  };
  
  // Optional: Custom content in the middle
  middleContent?: React.ReactNode;
  
  // Optional: Stats/info to show
  statusText?: string;
}

export function EditorToolbar({
  onBack,
  backLabel = "Back to Upload",
  actions = [],
  actionGroups = [],
  primaryAction,
  middleContent,
  statusText,
}: EditorToolbarProps) {
  // Flatten all actions for mobile menu
  const allActions = [
    ...actions,
    ...actionGroups.flatMap(group => group.actions)
  ];

  // Filter actions that should show in mobile menu
  const mobileMenuActions = allActions.filter(action => !action.hideOnMobile);

  return (
    <>
      {/* Desktop Toolbar */}
      <div className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          {/* Left: Back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Button>

          {/* Middle: Actions or Custom Content */}
          <div className="flex-1 flex items-center justify-center gap-2">
            {middleContent ? (
              middleContent
            ) : (
              <>
                {/* Render action groups with separators */}
                {actionGroups.length > 0 ? (
                  <div className="flex items-center gap-2">
                    {actionGroups.map((group, groupIndex) => (
                      <div key={group.id} className="flex items-center gap-2">
                        {group.actions.map((action) => (
                          <Button
                            key={action.id}
                            variant={action.variant || "ghost"}
                            size="sm"
                            onClick={action.onClick}
                            disabled={action.disabled}
                            className={action.className}
                            title={action.tooltip}
                          >
                            <action.icon className="w-4 h-4" />
                            <span className="hidden lg:inline ml-2">{action.label}</span>
                          </Button>
                        ))}
                        {groupIndex < actionGroups.length - 1 && (
                          <div className="w-px h-6 bg-gray-300 mx-1" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Render flat actions */
                  actions.map((action) => (
                    <Button
                      key={action.id}
                      variant={action.variant || "ghost"}
                      size="sm"
                      onClick={action.onClick}
                      disabled={action.disabled}
                      className={action.className}
                      title={action.tooltip}
                    >
                      <action.icon className="w-4 h-4" />
                      <span className="hidden lg:inline ml-2">{action.label}</span>
                    </Button>
                  ))
                )}
              </>
            )}
          </div>

          {/* Right: Status text and Primary action */}
          <div className="flex items-center gap-3">
            {statusText && (
              <span className="text-sm text-gray-600 hidden xl:block">
                {statusText}
              </span>
            )}
            {primaryAction && (
              <GradientButton
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
                size="sm"
                className="gap-2"
              >
                {primaryAction.label}
                {primaryAction.icon && <primaryAction.icon className="w-4 h-4" />}
              </GradientButton>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Toolbar */}
      <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-3 py-2 flex items-center justify-between gap-2">
          {/* Left: Back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1 px-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs">{backLabel}</span>
          </Button>

          {/* Right: Actions menu + Primary action */}
          <div className="flex items-center gap-2">
            {/* Mobile actions menu */}
            {mobileMenuActions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="px-2">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {actionGroups.length > 0 ? (
                    // Render grouped actions with separators
                    actionGroups.map((group, groupIndex) => (
                      <div key={group.id}>
                        {group.actions.filter(a => !a.hideOnMobile).map((action) => (
                          <DropdownMenuItem
                            key={action.id}
                            onClick={action.onClick}
                            disabled={action.disabled}
                            className={action.variant === "destructive" ? "text-red-600" : ""}
                          >
                            <action.icon className="w-4 h-4 mr-2" />
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                        {groupIndex < actionGroups.length - 1 && <DropdownMenuSeparator />}
                      </div>
                    ))
                  ) : (
                    // Render flat actions
                    mobileMenuActions.map((action) => (
                      <DropdownMenuItem
                        key={action.id}
                        onClick={action.onClick}
                        disabled={action.disabled}
                        className={action.variant === "destructive" ? "text-red-600" : ""}
                      >
                        <action.icon className="w-4 h-4 mr-2" />
                        {action.label}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Primary action */}
            {primaryAction && (
              <GradientButton
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
                size="sm"
                className="gap-1 text-xs px-3"
              >
                {primaryAction.label}
                {primaryAction.icon && <primaryAction.icon className="w-3 h-3" />}
              </GradientButton>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
