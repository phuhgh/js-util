/**
 * @public
 * Allows the entity to disabled, effectively being equivalent to the entity being removed.
 */
export interface IDisabledTrait
{
    /**
     * If true the entity should not be considered.
     */
    isDisabled?: boolean;
}