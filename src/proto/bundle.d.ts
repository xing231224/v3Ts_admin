import * as $protobuf from "protobufjs";
/** Properties of a MessageRequest. */
export interface IMessageRequest {

    /** MessageRequest status */
    status?: (string | null);

    /** MessageRequest key */
    key?: (string | null);

    /** MessageRequest data */
    data?: (Uint8Array | null);

    /** MessageRequest clientId */
    clientId?: (string | null);

    /** MessageRequest weChatId */
    weChatId?: (string | null);

    /** MessageRequest state */
    state?: (number | null);

    /** MessageRequest msg */
    msg?: (string | null);
}

/** Represents a MessageRequest. */
export class MessageRequest implements IMessageRequest {

    /**
     * Constructs a new MessageRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMessageRequest);

    /** MessageRequest status. */
    public status: string;

    /** MessageRequest key. */
    public key: string;

    /** MessageRequest data. */
    public data: Uint8Array;

    /** MessageRequest clientId. */
    public clientId: string;

    /** MessageRequest weChatId. */
    public weChatId: string;

    /** MessageRequest state. */
    public state: number;

    /** MessageRequest msg. */
    public msg: string;

    /**
     * Creates a new MessageRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MessageRequest instance
     */
    public static create(properties?: IMessageRequest): MessageRequest;

    /**
     * Encodes the specified MessageRequest message. Does not implicitly {@link MessageRequest.verify|verify} messages.
     * @param message MessageRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IMessageRequest, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified MessageRequest message, length delimited. Does not implicitly {@link MessageRequest.verify|verify} messages.
     * @param message MessageRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IMessageRequest, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a MessageRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MessageRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): MessageRequest;

    /**
     * Decodes a MessageRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MessageRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): MessageRequest;

    /**
     * Verifies a MessageRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string | null);

    /**
     * Creates a MessageRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MessageRequest
     */
    public static fromObject(object: { [k: string]: any }): MessageRequest;

    /**
     * Creates a plain object from a MessageRequest message. Also converts values to other types if specified.
     * @param message MessageRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: MessageRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this MessageRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
